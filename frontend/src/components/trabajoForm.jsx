const TrabajoForm = ({
    titulo, setTitulo,
    descripcion, setDescripcion,
    imagenUrl, setImagenUrl,
    sueldo, setSueldo,
    ubicacion, setUbicacion,
    longitud, setLongitud,
    latitud, setLatitud,
    contacto_whatsapp, setContacto_whatsapp,
    onSubmit, textoBoton, error, mensaje, loading
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
            <div className="form-row">
                <div className="form-group">
                    <label>Sueldo</label>
                    <input type="number"
                    value={sueldo} onChange={(e) => setSueldo(e.target.value)}
                    placeholder="Ej: 6500000"
                    />
                </div>
                <div className="form-group">
                    <label>Ubicacion/comuna</label>
                    <input type="text" 
                    value={ubicacion} onChange={(e)=> setUbicacion(e.target.value)}
                    placeholder="Ej: Providencia"/>
                </div>
            </div>
            <div className="form-group">
                <textarea 
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripcion"
                ></textarea>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Latitud</label>
                    <input type="text" 
                    value={latitud} 
                    onChange={(e) => setLatitud(e.target.value)}
                    placeholder="-33.123"/>
                </div>
                <div className="form-grop">
                    <label>Longitud</label>
                    <input type="text" 
                    value={longitud} 
                    onChange={(e) => setLongitud(e.target.value)}
                    placeholder="-70.123"/>
                </div>
            </div>
            <div className="form-group">
                <label>Contacto WhatsApp</label>
                <input type="text"
                value={contacto_whatsapp}
                onChange={(e) => setContacto_whatsapp(e.target.value)} 
                placeholder="+569..."/>
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