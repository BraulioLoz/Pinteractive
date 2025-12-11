import "./Landing.css";
import albumHumbe from "../assets/album-humbe.jpg";
import albumEminem from "../assets/album-eminem.jpg";
import albumBls from "../assets/album-bls.jpg";
import albumZoe from "../assets/album-zoe.jpg";

//creamos un arreglo con las imagenes
const images = [albumHumbe, albumEminem, albumBls, albumZoe];

//AUN NO ESTOY SEGURA DEL BOTON PERO LO DEJO, CUALQUEIR COSA LO BORRAMOS
export default function Landing() {
  return (
    <div className="landing-wrapper container-fluid">
        <div className="row justify-content-center align-items-center">
            <div className="col-lg-6 col-12 d-flex justify-content-center mb-4 mb-lg-0">
                <div className="landing-collage">
                    <img className="img img-1" src={images[0]} alt="Album 1" />
                    <img className="img img-2" src={images[1]} alt="Album 2" />
                    <img className="img img-3" src={images[2]} alt="Album 3" />
                    <img className="img img-4" src={images[3]} alt="Album 4" />
                </div>
            </div>
            <div className="col-lg-6 col-12 landing-text text-lg-start text-center">
                <h1>Encuentra imágenes con la vibe de canciones</h1>
                <p>
                    Descubre música según tu mood. Busca emociones como 
                    <strong> “chill”</strong>, <strong>“sad”</strong> o 
                    <strong> “party”</strong>, y deja que tu vibe te encuentre.
                </p>
                <button className="btn-explore">Explorar</button> 
            </div>
        </div>
    </div>
  );
}
