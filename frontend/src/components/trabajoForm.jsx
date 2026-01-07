const TrabajoForm = ({
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    imagenUrl,
    setImagenUrl,
    onSubmit,
    textoBoton,
    error,
    mensaje,
    loading
}) => {
    return(
        <form onSubmit={onSubmit}>
            {error && <div className="form-error">{error}</div>}
            {mensaje && <div className="form-success">{mensaje}</div>}
            <div className="form-group">
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="titulo"
                    required
                />
            </div>
            <div className="form-group">
                <textarea 
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripcion"
                ></textarea>
            </div>
            <div className="form-group">
            {setImagenUrl && (
                <input
                type="text"
                placeholder="URL de la imagen"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                />
            )}
            </div>

            <button className="form-button" type="submit" disabled={loading}>{textoBoton}</button>
        </form>
    );
};

export default TrabajoForm;