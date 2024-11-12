import {Col, Row} from "antd";

function About() {
    return (
        <div>
            <Row>
                <Col offset= {5} span = {14}>   
                    <h1>Proyecto final - Biblioteca</h1>
                    <h2>Condiciones generales para la realización</h2>                    
                    <ul>
                        <li>
                            El trabajo en cuestión es de carácter obligatorio y deberá ser presentado en fecha de final, para su exposición.
                        </li>
                        <li>Las tecnologías para realizar este trabajo son:
                            <ul>
                                <li>MongoDB (base de datos)</li>
                                <li>Express.js (routeo)</li>
                                <li>React.js / React Native (FrontEnd)</li>
                                <li>Node.js (BackEnd)</li>
                                <li>Librerías de UI: AntD, MaterialUI</li>
                            </ul>
                        </li>
                        <li>Las condiciones adicionales (obligatorias):
                            <ul>
                                <li>Seguridad con jwt utilizando localstorage/cookie/session </li>
                                <li>Mínimo de DOS roles que se loguean en el sistema</li>
                                <li>Alguna migración inicial de datos para que el sistema funcione</li>
                                <li>Relaciones entre distintas entidades</li>
                                <li>Logueo de errores</li>
                                <li>Valores cargados en variables de entorno (front y back)</li>
                                <li>Mínimo de 5 páginas con ruteo (front)</li>
                                <li>Mínimo de 4 entidades (back)</li>
                                <li>(opcional) Utilización de un bucket (AWS S3)</li>
                                <li>(opcional) Deployado en la nube (render, heroku, AWS)</li>
                            </ul>
                        </li>
                        <li>
                            El trabajo debe reproducir lo mejor posible las condiciones de un sistema real para la empresa. Por tratarse de una adaptación de caso real, la especificación puede contener las mismas ambigüedades que un sistema real. En tales casos, se puede consultar al docente del curso para resolver las dudas que tengan los alumnos.
                        </li>
                    </ul>
                    <h2>Condiciones generales de aprobación</h2>
                    <ul>
                        <li>
                            El trabajo debe funcionar correctamente, de acuerdo a todas las especificaciones solicitadas. Un trabajo que no contemple o implemente algunas de las funcionalidades descritas no podrá ser aprobado.
                        </li>
                        <li>
                            Documentación a incluir para la entrega: Repositorio de código online publicado para su revisión.
                        </li>
                        <li>
                            Se deberá incluir en dicho repositorio, un archivo de guía que muestre la descripción general del módulo e indique cómo correr/levantar dicho proyecto localmente junto con las migraciones correspondientes para poseer los datos iniciales (Readme.md)
                        </li>
                        <li>
                            La aplicación debe efectuar el tratamiento de errores necesarios (y de la manera pertinente), que le otorgue robustez a la aplicación (buen manejo de errores por pantalla, log en archivos de texto, etc.).
                        </li>
                    </ul>
                    <h2>Presentación del Trabajo</h2>
                    <p>
                        El desarrollo del trabajo práctico estará compuesto por la implementación del módulo asignado funcionando, junto con un repositorio el cual contenga el código desarrollado.
                    </p>
                    <p>
                        En una instancia de examen oral, se deberá exponer la defensa de lo realizado en dicho proyecto.
                    </p>
                    <p>
                        El link al repositorio en el cual se encontrará el proyecto, deberá ser informado para su revisión una semana antes, como mínimo, de la exposición final en fecha de examen.
                    </p>
                    <p>
                        IMPORTANTE: se puede pedir una modificación o nueva funcionalidad en el momento de la presentación.
                    </p>
                    <h2>Descripción general</h2>
                    <p>
                        El sistema a implementar debe contemplar las funcionalidades:
                    </p>
                    <ul>
                        <li>
                            Administración de Socios: personas que tienen permitido solicitar libros, los socios pueden ser penalizados con 15 días sin poder acceder a retirar libros por devolver tarde.                        
                        </li>
                        <li>
                            Administración de Libros: ejemplares que posee el establecimiento, los libros pueden ser solicitados para lectura en el establecimiento o retirarse en calidad de "préstamo". Hay ejemplares que no se permite el préstamo y son sólo para lectura en la biblioteca. Un mismo libro puede tener varios ejemplares en la biblioteca. Un ejemplar puede darse de baja por deterioro.
                        </li>
                        <li>
                            Administración de préstamos: Los préstamos se realizan por 15 días, pasado ese tiempo si el libro no es devuelto al socio se le imputa una penalización.
                        </li>
                    </ul>
                </Col>
            </Row>
        </div>
    )
}

export default About
