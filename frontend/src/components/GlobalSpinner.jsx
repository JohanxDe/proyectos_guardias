import useLoading from "../hooks/useLoading";

const GlobalSpinner = () => {
    const {loading} = useLoading();

    if(!loading) return null;

    return(
        <div style={styles.overlay}>
            <div style={styles.spinner}></div>
        </div>
    );
};

const styles = {
    overlay:{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    },
    spinner: {
        width: "50px",
        height: "50px",
        border: "6px solid #ccc",
        borderTop: "6px solid #333",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    },
};

export default GlobalSpinner;