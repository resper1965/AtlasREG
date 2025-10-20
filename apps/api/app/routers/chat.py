"""
Router para Chat com Agente Atlas
WebSocket para real-time + REST endpoint
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.agents.atlas_agent import AtlasAgent


router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    """Request para endpoint REST"""
    message: str
    session_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    """Response do chat"""
    response: str
    timestamp: str
    session_id: str


@router.post("", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint REST para chat (alternativa ao WebSocket)
    
    Usage:
    ```
    POST /api/v1/chat
    {
        "message": "Quais foram as maiores multas da Taesa?",
        "session_id": "default"
    }
    ```
    """
    # Criar agente
    agent = AtlasAgent(
        user_id=current_user.id,
        session_id=request.session_id
    )
    
    try:
        # Processar mensagem
        response = await agent.chat(request.message)
        
        return ChatResponse(
            response=response,
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar mensagem: {str(e)}"
        )


@router.delete("/history")
async def clear_chat_history(
    session_id: str = "default",
    current_user: User = Depends(get_current_user)
):
    """
    Limpa histórico de conversação
    """
    agent = AtlasAgent(
        user_id=current_user.id,
        session_id=session_id
    )
    
    agent.clear_history()
    
    return {"status": "success", "message": "Histórico limpo"}


# WebSocket para chat real-time
@router.websocket("/ws/{session_id}")
async def websocket_chat(
    websocket: WebSocket,
    session_id: str,
    # TODO: Implementar auth para WebSocket
    # current_user: User = Depends(get_current_user_ws)
):
    """
    WebSocket para chat em tempo real
    
    Usage:
    ```javascript
    const ws = new WebSocket('ws://localhost:8200/api/v1/chat/ws/default');
    
    ws.onopen = () => {
        ws.send(JSON.stringify({
            message: "Quais as maiores multas?"
        }));
    };
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data.response);
    };
    ```
    """
    await websocket.accept()
    
    # TODO: Extrair user_id do token
    # Por ora, usar user_id fixo para teste
    user_id = 1
    
    agent = AtlasAgent(user_id=user_id, session_id=session_id)
    
    try:
        while True:
            # Receber mensagem
            data = await websocket.receive_json()
            message = data.get("message", "")
            
            if not message:
                await websocket.send_json({
                    "error": "Mensagem vazia"
                })
                continue
            
            # Processar com agente
            response = await agent.chat(message)
            
            # Enviar resposta
            await websocket.send_json({
                "type": "message",
                "role": "assistant",
                "content": response,
                "timestamp": datetime.now().isoformat()
            })
    
    except WebSocketDisconnect:
        print(f"🔌 WebSocket desconectado: session={session_id}")
    
    except Exception as e:
        print(f"❌ Erro no WebSocket: {e}")
        await websocket.send_json({
            "type": "error",
            "error": str(e)
        })
        await websocket.close()

