import React from 'react'
import {ExclamationCircleOutlined} from '@ant-design/icons'

/*
let f = new Date ();
f = setDate(f.getDate()+15);

const expira = new Date() + 15 * 86400000; // memo

*/

const comprobarPrestamo = (x) => 
    Math.floor((new Date() - new Date(x)) / 86400000) > 15;
    
const formatear = (x) => {
    const y = new Date (x);
    return '' + (1 + y.getDate()) + '/' 
              + (1 + y.getMonth()) + '/' 
              +      y.getFullYear();    
};

const Prestamo = ({libro, socio, fecha}) => {
    return (
    <>
        <li>            
            <u>Libro:</u> <i>{libro}</i>
            <br></br>
            <u>Socio:</u> <i>{socio}</i>
            <br></br>
            <u>Fecha de préstamo:</u> <i>{formatear(fecha)}</i>
            <br></br>
            {comprobarPrestamo(fecha) &&
                <>                       
                <ExclamationCircleOutlined />
                <b>{' SOCIO EN INFRACCION'}</b>                 
                <br></br>    
                </>
                }                          
            <br></br>
        </li>    
    </>)
}

export default Prestamo