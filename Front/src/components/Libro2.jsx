import React from 'react';
import { Button, Divider} from 'antd';

function Libro2 ({id, titulo, autor, cant, prestable}) {
    return (
        <p>  
            <u>ID:</u> {id}.
            <br></br>    
            <u>Titulo:</u> {titulo}.
            <br></br>
            <u>Autor:</u> {autor}.
            <br></br>
            <u>Cantidad de ejemplares:</u> {cant}.
            <br></br>
            <u>Se puede prestar:</u> {prestable? 'Si' : 'No'} 
        </p>
    )
} 

export default Libro2