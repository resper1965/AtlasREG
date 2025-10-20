"""
Entity Extractor
Extrai entidades usando spaCy (empresas, datas, valores)
"""

import spacy
import re
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class EntityExtractor:
    """
    Extrai entidades nomeadas de documentos usando spaCy
    """
    
    def __init__(self):
        """Inicializa extrator com modelo português"""
        
        # Carregar modelo spaCy português
        # Download: python -m spacy download pt_core_news_lg
        try:
            self.nlp = spacy.load("pt_core_news_lg")
            logger.info("🧠 spaCy PT loaded")
        except:
            logger.warning("⚠️  pt_core_news_lg não encontrado. Usando pt_core_news_sm")
            self.nlp = spacy.load("pt_core_news_sm")
        
        # Padrões customizados
        self.cnpj_pattern = re.compile(r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}')
        self.money_pattern = re.compile(r'R\$\s*([\d.,]+)\s*(mil|milhão|milhões|bilhão|bilhões)?')
    
    def extract(self, text: str) -> Dict[str, List]:
        """
        Extrai entidades do texto
        
        Args:
            text: Texto para análise
        
        Returns:
            Dict com entidades por tipo
        """
        
        doc = self.nlp(text)
        
        entities = {
            "companies": [],
            "locations": [],
            "persons": [],
            "organizations": [],
            "dates": [],
            "values": [],
            "cnpjs": []
        }
        
        # Entidades do spaCy
        for ent in doc.ents:
            if ent.label_ == "ORG":
                entities["organizations"].append({
                    "text": ent.text,
                    "label": "organization"
                })
            elif ent.label_ == "LOC":
                entities["locations"].append({
                    "text": ent.text,
                    "label": "location"
                })
            elif ent.label_ == "PER":
                entities["persons"].append({
                    "text": ent.text,
                    "label": "person"
                })
        
        # Detectar empresas transmissoras (padrões customizados)
        company_keywords = [
            "transmissora", "transmissão", "energia", "elétrica",
            "S.A.", "Ltda", "S/A"
        ]
        
        for token in doc:
            if token.pos_ == "PROPN":  # Nome próprio
                # Verificar contexto
                window = doc[max(0, token.i-3):min(len(doc), token.i+3)]
                context = " ".join([t.text for t in window])
                
                for keyword in company_keywords:
                    if keyword.lower() in context.lower():
                        entities["companies"].append({
                            "text": token.text,
                            "context": context,
                            "confidence": 0.7
                        })
                        break
        
        # Extrair CNPJs
        cnpjs = self.cnpj_pattern.findall(text)
        entities["cnpjs"] = [{"value": cnpj} for cnpj in cnpjs]
        
        # Extrair valores monetários
        money_matches = self.money_pattern.findall(text)
        for match in money_matches:
            value_str, multiplier = match
            
            # Converter para número
            value = float(value_str.replace(".", "").replace(",", "."))
            
            # Aplicar multiplicador
            if multiplier:
                if "mil" in multiplier:
                    value *= 1_000
                elif "milhão" in multiplier or "milhões" in multiplier:
                    value *= 1_000_000
                elif "bilhão" in multiplier or "bilhões" in multiplier:
                    value *= 1_000_000_000
            
            entities["values"].append({
                "amount": value,
                "currency": "BRL",
                "text": f"R$ {value_str} {multiplier or ''}".strip()
            })
        
        # Remover duplicatas
        for key in entities:
            if isinstance(entities[key], list):
                # Dedup por texto
                seen = set()
                unique = []
                for item in entities[key]:
                    text_key = item.get("text", item.get("value", ""))
                    if text_key not in seen:
                        seen.add(text_key)
                        unique.append(item)
                entities[key] = unique
        
        logger.info(f"🔍 Extraídas {sum(len(v) for v in entities.values())} entidades")
        
        return entities
    
    def extract_companies_only(self, text: str) -> List[str]:
        """
        Extrai apenas nomes de empresas
        
        Args:
            text: Texto
        
        Returns:
            Lista de nomes de empresas
        """
        entities = self.extract(text)
        
        companies = []
        companies.extend([c["text"] for c in entities["companies"]])
        
        # Organizações que contém keywords de transmissão
        for org in entities["organizations"]:
            if any(kw in org["text"].lower() for kw in ["transmissora", "energia", "elétrica"]):
                companies.append(org["text"])
        
        return list(set(companies))


# Singleton
_extractor_instance = None

def get_extractor() -> EntityExtractor:
    """Retorna instância singleton do extrator"""
    global _extractor_instance
    
    if _extractor_instance is None:
        _extractor_instance = EntityExtractor()
    
    return _extractor_instance

