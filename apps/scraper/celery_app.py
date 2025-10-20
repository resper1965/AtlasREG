from celery import Celery
import os

broker_url = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/1')
result_backend = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/1')

app = Celery('atlasreg', broker=broker_url, backend=result_backend)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/Sao_Paulo',
    enable_utc=True,
)

@app.task
def hello_task():
    return "Hello from AtlasReg Celery!"

if __name__ == '__main__':
    app.start()
