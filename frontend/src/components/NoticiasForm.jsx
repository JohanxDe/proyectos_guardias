const NoticiasForm = ({
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    categoria,
    setCategoria,
    imagenUrl,
    setImagenUrl,
    onSubmit,
    textoBoton,
    error,
    mensaje,
    loading
}) => {
    return (
        <form onSubmit={onSubmit}>
            {error && <div className="form-error">{error}</div>}
            {mensaje && <div className="form-success">{mensaje}</div>}

            <div className="form-group">
                <label className="form-label">Título</label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: Nueva actualización de seguridad"
                    required
                />
            </div>

            {/* NUEVO: Campo de Categoría */}
            <div className="form-group">
                <label className="form-label">Categoría</label>
                <select
                    className="form-select"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                >
                    <option value="Noticias">Noticias</option>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Capacitación">Capacitación</option>
                    <option value="Eventos">Eventos</option>
                    <option value="OS10">OS10</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Escribe el contenido aquí..."
                    required
                ></textarea>
            </div>

            <div className="form-group">
                <label className="form-label">URL de la imagen (opcional)</label>
                {setImagenUrl && (
                    <input
                        type="text"
                        placeholder="https://link-de-tu-imagen.jpg"
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                    />
                )}
            </div>

            <button
                className="form-button"
                type="submit"
                disabled={loading}
            >
                {loading ? "Procesando..." : textoBoton}
            </button>
        </form>
    );
};

export default NoticiasForm;