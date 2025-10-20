"""
Document Classifier
Classifica documentos usando BERTimbau
"""

import torch
from transformers import BertTokenizer, BertForSequenceClassification
from typing import Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class DocumentClassifier:
    """
    Classifica documentos em categorias usando BERTimbau
    """
    
    def __init__(self, model_path: str = "neuralmind/bert-base-portuguese-cased"):
        """
        Inicializa classificador
        
        Args:
            model_path: Caminho ou nome do modelo HuggingFace
        """
        self.tokenizer = BertTokenizer.from_pretrained(model_path)
        self.model = BertForSequenceClassification.from_pretrained(
            model_path,
            num_labels=7  # 7 tipos de documento
        )
        
        # Labels
        self.labels = [
            "news",           # 0: Notícia genérica
            "regulation",     # 1: Decisão regulatória
            "fine",           # 2: Multa/PV
            "incident",       # 3: Ocorrência operacional
            "transaction",    # 4: M&A
            "report",         # 5: Relatório técnico
            "other"           # 6: Outro
        ]
        
        self.model.eval()
        logger.info("🤖 BERTimbau Classifier carregado")
    
    def classify(self, text: str) -> Tuple[str, float]:
        """
        Classifica um documento
        
        Args:
            text: Texto do documento (título + resumo ou corpo)
        
        Returns:
            (label, confidence): Tupla com label e confiança (0-1)
        """
        
        # Truncar texto para BERT (512 tokens)
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=512
        )
        
        # Classificar
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probs = torch.nn.functional.softmax(logits, dim=-1)
            
            # Melhor predição
            predicted_class = torch.argmax(probs, dim=-1).item()
            confidence = probs[0][predicted_class].item()
        
        label = self.labels[predicted_class]
        
        logger.info(f"📊 Classificado como '{label}' (confiança: {confidence:.2%})")
        
        return label, confidence
    
    def classify_batch(self, texts: list) -> list:
        """
        Classifica múltiplos documentos em batch
        
        Args:
            texts: Lista de textos
        
        Returns:
            Lista de tuplas (label, confidence)
        """
        results = []
        
        for text in texts:
            label, confidence = self.classify(text)
            results.append((label, confidence))
        
        return results
    
    def get_label_probabilities(self, text: str) -> Dict[str, float]:
        """
        Retorna probabilidades para todos os labels
        
        Args:
            text: Texto do documento
        
        Returns:
            Dict com label: probabilidade
        """
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=512
        )
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # Criar dict
        result = {}
        for i, label in enumerate(self.labels):
            result[label] = probs[0][i].item()
        
        return result


# Singleton
_classifier_instance = None

def get_classifier() -> DocumentClassifier:
    """Retorna instância singleton do classificador"""
    global _classifier_instance
    
    if _classifier_instance is None:
        _classifier_instance = DocumentClassifier()
    
    return _classifier_instance

