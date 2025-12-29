const TrabajoForm = ({
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    imagenUrl,
    setImagenUrl,
    onsubmit,
    textoBoton,
    error,
    mensaje,
    loading
}) => {
    return(
        <form onSubmit={onsubmit}>
            {error && <p style={{color: "red"}}>{error}</p>}
            {mensaje && <p style={{color: "green"}}>{mensaje}</p>}

            <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="titulo"
                required
            />

            <textarea 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripcion"
            ></textarea>

            {setImagenUrl && (
                <input
                type="text"
                placeholder="URL de la imagen"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                />
            )}

            <button type="submit" disabled={loading}>{textoBoton}</button>
        </form>
    );
};

export default TrabajoForm;