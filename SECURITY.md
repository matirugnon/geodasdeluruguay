# 🔒 Guía de Seguridad para Contribuidores

## ⚠️ IMPORTANTE: Antes de hacer commit

Antes de hacer push de cualquier cambio, asegúrate de:

### ✅ Checklist de Seguridad

- [ ] **NO** incluir archivos `.env` en el repositorio
- [ ] **NO** hacer commit de credenciales hardcodeadas
- [ ] **NO** subir API keys de Cloudinary
- [ ] **NO** incluir tokens JWT en el código
- [ ] **NO** subir strings de conexión de MongoDB con credenciales
- [ ] Verificar que `.gitignore` esté actualizado
- [ ] Usar variables de entorno para TODOS los secretos
- [ ] Revisar el diff antes de hacer commit

### 🔑 Gestión de Variables de Entorno

Todas las credenciales y secretos deben estar en archivos `.env`:

```bash
# ✅ CORRECTO
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

# ❌ INCORRECTO - NUNCA HACER ESTO
const mongoUri = "mongodb+srv://user:password@cluster...";
const jwtSecret = "mi-super-secreto-123";
```

### 📁 Archivos Sensibles

Los siguientes archivos/patrones están en `.gitignore` y **NUNCA** deben ser commiteados:

- `*.env` (todos los archivos de entorno)
- Credenciales de Cloudinary
- Tokens y API keys
- Dumps de base de datos
- Archivos `*.pem`, `*.key`, `*.p12`

### 🛠️ Comandos Útiles

Verificar archivos que serán commiteados:
```bash
git status
```

Ver cambios antes de commit:
```bash
git diff
```

Remover archivo accidentalmente agregado:
```bash
git rm --cached archivo-sensible.env
```

### 🚨 Si Accidentalmente Commiteaste Datos Sensibles

1. **NO** hagas push
2. Revierte el commit: `git reset HEAD~1`
3. Elimina el archivo del staging: `git rm --cached archivo`
4. Agrega el patrón a `.gitignore`
5. Vuelve a hacer commit

Si ya hiciste push:
1. Cambia INMEDIATAMENTE todas las credenciales expuestas
2. Contacta al administrador del repositorio
3. Considera usar `git filter-branch` o BFG Repo-Cleaner

### 📞 Reportar Problemas de Seguridad

Si encuentras una vulnerabilidad de seguridad, **NO** abras un issue público. Contacta directamente al mantenedor del proyecto.

---

## 🔐 Configuración Inicial Segura

1. Copia `.env.example` a `.env`:
```bash
cp backend/.env.example backend/.env
```

2. Edita `.env` con tus credenciales reales
3. **NUNCA** compartas tu archivo `.env`
4. **NUNCA** hagas commit de `.env`

---

**Recuerda:** La seguridad es responsabilidad de todos. Cuando tengas dudas, pregunta antes de hacer commit.
