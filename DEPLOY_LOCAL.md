# 🚀 Deploy Local - AtlasReg by ness.

**Status:** Iniciando deploy completo local

---

## 📋 CHECKLIST

### ✅ Infraestrutura (Docker)
- [x] Redis rodando (porta 6381)
- [x] MinIO rodando (portas 19000/19001)
- [x] Elasticsearch rodando (porta 19200)

### ⏳ Backend (FastAPI)
- [ ] .env configurado
- [ ] Dependencies instaladas
- [ ] Database conectado
- [ ] API rodando (porta 8100)

### ⏳ Frontend (Next.js)
- [ ] .env.local configurado
- [ ] Dependencies instaladas (JÁ FEITO)
- [ ] Build success
- [ ] App rodando (porta 3000)

---

## 🎯 COMANDOS

### 1. Infraestrutura (JÁ RODANDO)
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 2. Backend
```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8100
```

### 3. Frontend
```bash
cd apps/web
npm run dev
```

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8100
- **API Docs:** http://localhost:8100/docs
- **MinIO Console:** http://localhost:19001 (admin/atlasreg2025)
- **Elasticsearch:** http://localhost:19200

---

**Powered by:** ness. 💙

