# Evacuación Coderider

Aplicación web desarrollada con Django para gestionar información relacionada con evacuación, reportes, multimedia y panel de control del proyecto **Coderider**.

## Descripción

Este proyecto permite:

- Registrar reportes de evacuación.
- Subir imágenes y documentos asociados.
- Mostrar contenido multimedia (imágenes, audio, videos y recursos estáticos).
- Exponer una interfaz web con navegación y dashboard básico.
- Gestionar la información en SQLite mediante Django ORM.

## Requisitos

- Python 3.10 o superior
- Django 6.1.1
- Git
- Entorno virtual recomendado

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd Evacuacioncoderider
```

2. Crea y activa un entorno virtual:

```bash
python -m venv .venv
```

En Windows:

```bash
.venv\Scripts\activate
```

En Linux/macOS:

```bash
source .venv/bin/activate
```

3. Instala las dependencias:

```bash
pip install django
```

4. Aplica las migraciones:

```bash
python manage.py migrate
```

5. Crea un superusuario para el panel administrativo:

```bash
python manage.py createsuperuser
```

## Ejecución

Inicia el servidor local:

```bash
python manage.py runserver
```

Luego abre en el navegador:

```text
http://127.0.0.1:8000/
```

## Estructura principal

```text
Evacuacioncoderider/
├── app_evacuacion_coderider/
│   ├── static/
│   ├── templates/
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   ├── views.py
│   └── ...
├── app_transferencia/
├── config/
├── db.sqlite3
├── manage.py
├── README.md
└── requirements.txt  (si se agrega más adelante)
```

## Uso

- La página principal muestra la interfaz de evacuación.
- Desde allí puedes registrar reportes y consultar la información cargada.
- El panel administrativo de Django se encuentra en:

```text
http://127.0.0.1:8000/admin/
```

## Notas

- La configuración actual usa SQLite para desarrollo local.
- Los archivos estáticos y multimedia se ubican dentro de la carpeta `app_evacuacion_coderider/static`.
- Si deseas, puedes agregar más mejoras como autenticación, validaciones avanzadas, filtros por fecha o exportación de reportes.

## Licencia

Este proyecto se entrega con fines educativos y de desarrollo.
