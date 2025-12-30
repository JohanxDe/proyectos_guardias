import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContex";

const useLoading = () =>{
    return useContext(LoadingContext);
};

export default useLoading;