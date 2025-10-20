"""
Airflow DAG: ANEEL Daily News Scraper
Coleta notícias da ANEEL todos os dias às 06:00 BRT
"""

from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import subprocess

# Configuração do DAG
default_args = {
    'owner': 'atlasreg-by-ness',
    'depends_on_past': False,
    'email': ['alertas@atlasreg.com'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=1)
}

dag = DAG(
    'aneel_news_daily',
    default_args=default_args,
    description='Coleta diária de notícias da ANEEL sobre transmissão de energia',
    schedule_interval='0 6 * * *',  # Cron: Todo dia às 06:00
    start_date=datetime(2025, 10, 17),
    catchup=False,  # Não executar runs passados
    tags=['scraping', 'aneel', 'daily']
)

def run_aneel_scraper(**context):
    """Executar Scrapy spider ANEEL"""
    
    print("🕷️  Iniciando scraper ANEEL News...")
    
    # Rodar Scrapy spider
    result = subprocess.run([
        'scrapy', 'crawl', 'aneel_news',
        '-o', f'/tmp/aneel_news_{datetime.now().strftime("%Y%m%d")}.json'
    ], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ Scraper concluído com sucesso")
        print(f"📊 Output: {result.stdout}")
        
        # Push to XCom para próximas tasks
        context['task_instance'].xcom_push(
            key='scrape_status',
            value='success'
        )
    else:
        print(f"❌ Erro no scraper: {result.stderr}")
        raise Exception(f"Scraper failed: {result.stderr}")

def trigger_processing(**context):
    """Disparar processamento dos documentos coletados"""
    
    print("🤖 Disparando processamento de IA...")
    
    # TODO: Chamar Celery task para processar novos documentos
    # from tasks import process_new_documents
    # process_new_documents.delay()
    
    print("✅ Processamento disparado")

def send_summary_notification(**context):
    """Enviar notificação de summary da coleta"""
    
    scrape_status = context['task_instance'].xcom_pull(
        task_ids='scrape_aneel',
        key='scrape_status'
    )
    
    if scrape_status == 'success':
        print("📧 Enviando notificação de sucesso...")
        # TODO: Enviar email para admin
        print("✅ Notificação enviada")

# Tasks do DAG
task_scrape = PythonOperator(
    task_id='scrape_aneel',
    python_callable=run_aneel_scraper,
    dag=dag
)

task_process = PythonOperator(
    task_id='trigger_processing',
    python_callable=trigger_processing,
    dag=dag
)

task_notify = PythonOperator(
    task_id='notify_summary',
    python_callable=send_summary_notification,
    dag=dag
)

# Definir dependências (ordem de execução)
task_scrape >> task_process >> task_notify

"""
Fluxo de Execução:
1. 06:00 - Airflow scheduler dispara DAG
2. 06:00-06:10 - Scraper coleta notícias (task_scrape)
3. 06:10-06:15 - Dispara processamento IA (task_process)
4. 06:15 - Envia notificação de summary (task_notify)

Visualização no Airflow UI: http://localhost:8200
"""

