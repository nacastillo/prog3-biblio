import { useNavigate} from "react-router-dom";
import { useContext, useEffect} from "react";
import { AuthContext } from "../../components/AuthContext";

function Logout() {
    const nav = useNavigate();
    const {logout} = useContext(AuthContext);    

    useEffect (() => {
        logout();        
        nav("/login");
    },[]);
}

export default Logout