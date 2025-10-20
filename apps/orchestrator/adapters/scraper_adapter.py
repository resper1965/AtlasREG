"""
AtlasReg Cursor - Scraper Adapter
Executa scrapers diretamente (fallback se Airflow nao disponivel)
"""

import subprocess
import json
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
from utils.logger import get_logger

logger = get_logger(__name__)


class ScraperAdapter:
    """Adapter para executar scrapers Scrapy diretamente"""
    
    def __init__(
        self,
        scrapy_project_path: str = "/app/scrapers"
    ):
        """
        Inicializa adapter.
        
        Args:
            scrapy_project_path: Path do projeto Scrapy
        """
        self.scrapy_project_path = Path(scrapy_project_path)
    
    def run_spider(
        self,
        spider_name: str,
        output_file: Optional[str] = None,
        args: Optional[Dict[str, str]] = None,
        timeout: int = 600
    ) -> Dict[str, Any]:
        """
        Executa spider Scrapy.
        
        Args:
            spider_name: Nome do spider
            output_file: Path do arquivo de output (opcional)
            args: Argumentos adicionais para o spider
            timeout: Timeout (segundos)
        
        Returns:
            Dict com resultado da execucao
        """
        logger.info("running_spider", spider=spider_name)
        
        # Construir comando
        cmd = ['scrapy', 'crawl', spider_name]
        
        # Output file
        if not output_file:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"/tmp/{spider_name}_{timestamp}.json"
        
        cmd.extend(['-o', output_file])
        
        # Argumentos adicionais
        if args:
            for key, value in args.items():
                cmd.extend(['-a', f'{key}={value}'])
        
        # Loglevel
        cmd.extend(['--loglevel=INFO'])
        
        logger.debug("spider_command", cmd=' '.join(cmd))
        
        try:
            # Executar scrapy
            result = subprocess.run(
                cmd,
                cwd=str(self.scrapy_project_path),
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            success = result.returncode == 0
            
            # Contar items coletados
            items_count = 0
            if success and Path(output_file).exists():
                try:
                    with open(output_file, 'r') as f:
                        items = json.load(f)
                        items_count = len(items) if isinstance(items, list) else 1
                except:
                    items_count = 0
            
            log_data = {
                'spider': spider_name,
                'success': success,
                'items_count': items_count,
                'output_file': output_file,
                'returncode': result.returncode
            }
            
            if success:
                logger.info("spider_completed_success", **log_data)
            else:
                logger.error(
                    "spider_failed",
                    **log_data,
                    stderr=result.stderr[:500]
                )
            
            return {
                'success': success,
                'items_count': items_count,
                'output_file': output_file,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'returncode': result.returncode
            }
            
        except subprocess.TimeoutExpired:
            logger.error("spider_timeout", spider=spider_name, timeout=timeout)
            raise
        
        except Exception as e:
            logger.error("spider_execution_error", spider=spider_name, error=str(e))
            raise

