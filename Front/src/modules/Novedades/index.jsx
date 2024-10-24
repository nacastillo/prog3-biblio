import {useEffect, useState} from "react";
import {Row, Col, Carousel, message} from "antd";
import serv from "../../services/librapi";

const estilo = {    
    color: "#FAFAFA",
    paddingInline: "20px",
    paddingBlock: "10px",
    margin: "0px"
};

function crearNovedad (titulo, cuerpo) {
    return (
        <div>
            <h2 style = {estilo}>{titulo}</h2>
            <p style = {estilo}>{cuerpo}</p>
        </div>
    )
};

function crearNovedad2 (tit, cu) {
    return (
        {
            titulo: tit,
            cuerpo: cu
        }
    )
};

const datos = [
    crearNovedad("Novedad 1", "Cuerpo de la novedad 1"),
    crearNovedad("Novedad 2", "Cuerpo de la novedad 2"),
    crearNovedad("Novedad 3", "Cuerpo de la novedad 3"),
    crearNovedad("Novedad 4", "Cuerpo de la novedad 4"),
    crearNovedad("Novedad 5", "Cuerpo de la novedad 5")
];

const datos2 = [
    crearNovedad2("Novedad 1", "Cuerpo de la novedad 1"),
    crearNovedad2("Novedad 2", "Cuerpo de la novedad 2"),
    crearNovedad2("Novedad 3", "Cuerpo de la novedad 3"),
    crearNovedad2("Novedad 4", "Cuerpo de la novedad 4"),
    crearNovedad2("Novedad 5", "Cuerpo de la novedad 5")
]

function Novedades () {
    const [novedades, setNovedades] = useState([]);

    // despues agregarle async
    function pegar () {
        try {
            setNovedades(datos2);
            console.log("datos2 es:")
            console.log(datos2);
        }
        catch (err) {
            message.error(err);
        }
    } 
    

    useEffect(() => {
        pegar();
        console.log("novedades es:");
        console.log(novedades)
    },[]);

    return (
        <div>
            <Row justify = "center">
                <Col span = {23} >
                    <Carousel 
                        style = {{backgroundColor: "#364D79", height: "700px"}}
                        autoplay
                        autoplaySpeed={3000} 
                        arrows
                    >                        
                    {
                        datos2.map(
                            x => (
                                <div>
                                    <h2 style = {estilo}>{x.titulo}</h2>
                                    <p style = {estilo}>{x.cuerpo}</p>
                                </div>
                            )
                        )
                    }                            
                    </Carousel>                
                </Col>                
            </Row>
        </div>
    )
}

export default Novedades
