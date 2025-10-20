"""
AtlasReg Cursor - HMAC Signer
Assinatura HMAC-SHA256 para webhooks
"""

import hmac
import hashlib
import json
from typing import Dict, Any


class HMACSigner:
    """Assina payloads com HMAC-SHA256"""
    
    def __init__(self, secret: str):
        """
        Inicializa signer com secret.
        
        Args:
            secret: HMAC secret key
        """
        self.secret = secret.encode('utf-8')
    
    def sign(self, payload: Dict[str, Any]) -> str:
        """
        Assina payload JSON com HMAC-SHA256.
        
        Args:
            payload: Dicionario a ser assinado
        
        Returns:
            Signature hexadecimal
        """
        # Serializar payload para JSON canonico (sorted keys)
        payload_bytes = json.dumps(
            payload, 
            sort_keys=True, 
            separators=(',', ':')
        ).encode('utf-8')
        
        # Gerar HMAC
        signature = hmac.new(
            self.secret,
            payload_bytes,
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    def verify(self, payload: Dict[str, Any], signature: str) -> bool:
        """
        Verifica se signature e valida para payload.
        
        Args:
            payload: Dicionario original
            signature: Signature recebida
        
        Returns:
            True se valida, False caso contrario
        """
        expected_signature = self.sign(payload)
        return hmac.compare_digest(expected_signature, signature)
    
    def sign_with_header(self, payload: Dict[str, Any]) -> Dict[str, str]:
        """
        Assina payload e retorna headers HTTP.
        
        Args:
            payload: Dicionario a ser assinado
        
        Returns:
            Dict com headers incluindo X-Signature
        """
        signature = self.sign(payload)
        
        return {
            'Content-Type': 'application/json',
            'X-Signature': signature,
            'X-Signature-Algorithm': 'HMAC-SHA256'
        }

