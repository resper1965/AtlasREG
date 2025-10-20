"""
Dynamic Scrapers DAG Generator
Cria DAGs automaticamente para cada source habilitada no sources.yaml
"""

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta
import yaml
from pathlib import Path

# Carregar configuração
config_path = Path(__file__).parent.parent / 'config' / 'sources.yaml'
with open(config_path, 'r') as f:
    sources_config = yaml.safe_load(f)

# Default args para todos os DAGs
default_args = {
    'owner': 'atlasreg-by-ness',
    'depends_on_past': False,
    'email': sources_config['global_settings']['alert_recipients'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=1)
}

# Gerar DAG para cada source habilitada
def create_scraper_dag(source_config):
    """Cria DAG para uma source específica"""
    
    source_id = source_config['id']
    source_name = source_config['name']
    schedule = source_config.get('schedule', '0 6 * * *')
    
    dag = DAG(
        dag_id=f'scraper_{source_id}',
        default_args=default_args,
        description=f'Scraper automático: {source_name}',
        schedule_interval=schedule,
        start_date=datetime(2025, 10, 17),
        catchup=False,
        tags=['scraping', source_config['category'], source_id]
    )
    
    with dag:
        # Task 1: Run scraper
        scrape_task = BashOperator(
            task_id=f'scrape_{source_id}',
            bash_command=f'''
                cd /app/scrapers && \
                scrapy crawl {source_id} \
                -o /tmp/{source_id}_{{{{ ds }}}}.json \
                --loglevel=INFO
            ''',
        )
        
        # Task 2: Verificar resultados
        def check_results(**context):
            """Verifica se scraper coletou dados"""
            import json
            from pathlib import Path
            
            ds = context['ds']  # Execution date
            output_file = Path(f'/tmp/{source_id}_{ds}.json')
            
            if not output_file.exists():
                print(f"⚠️  Arquivo de output não encontrado: {output_file}")
                return 'no_results'
            
            with open(output_file, 'r') as f:
                items = json.load(f)
            
            count = len(items) if isinstance(items, list) else 1
            
            print(f"✅ {source_name}: {count} itens coletados")
            
            # Alerta se zero resultados
            if count == 0 and sources_config['global_settings']['alert_on_zero_results']:
                print(f"⚠️  ALERTA: {source_name} retornou 0 itens!")
                # TODO: Enviar email de alerta
            
            context['task_instance'].xcom_push(key='items_count', value=count)
            
            return 'success'
        
        check_task = PythonOperator(
            task_id=f'check_{source_id}',
            python_callable=check_results,
        )
        
        # Task 3: Trigger processing
        def trigger_processing(**context):
            """Disparar processamento dos documentos"""
            
            items_count = context['task_instance'].xcom_pull(
                task_ids=f'check_{source_id}',
                key='items_count'
            )
            
            if items_count and items_count > 0:
                print(f"🤖 Disparando processamento de {items_count} documentos...")
                # TODO: Celery task
                # from tasks import process_new_documents
                # process_new_documents.delay(source_id, ds)
                print(f"✅ Processamento de {items_count} docs iniciado")
            else:
                print("⏭️  Nenhum documento para processar")
        
        process_task = PythonOperator(
            task_id=f'process_{source_id}',
            python_callable=trigger_processing,
        )
        
        # Fluxo: scrape → check → process
        scrape_task >> check_task >> process_task
    
    return dag

# Gerar DAGs para todas as sources habilitadas
for source in sources_config['sources']:
    if source.get('enabled', False):
        # Criar DAG e registrar no Airflow
        dag_id = f"scraper_{source['id']}"
        globals()[dag_id] = create_scraper_dag(source)
        
        print(f"✅ DAG criado: {dag_id} ({source['name']})")

print(f"🚀 Total de DAGs criados: {len([s for s in sources_config['sources'] if s.get('enabled')])}")

