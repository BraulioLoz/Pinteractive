import "./Landing.css";
import albumHumbe from "../assets/album-humbe.jpg";
import albumEminem from "../assets/album-eminem.jpg";
import albumBls from "../assets/album-bls.jpg";
import albumZoe from "../assets/album-zoe.jpg";
//Página en el que aterriza el usuario al entrar a la web

//creamos un arreglo con las imagenes
const images = [albumHumbe, albumEminem, albumBls, albumZoe];

//Componente Landing
export default function Landing() {
  return (
    <section className="landing-wrapper">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-12 col-md-6 order-1 order-md-1">
                    <div className="landing-collage">
                        <img className="img img-1" src={images[0]} alt="Album 1" />
                        <img className="img img-2" src={images[1]} alt="Album 2" />
                        <img className="img img-3" src={images[2]} alt="Album 3" />
                        <img className="img img-4" src={images[3]} alt="Album 4" />
                    </div>
                </div>
                <div className="col-12 col-md-6 order-2 order-md-2 ">
                    <div className="landing-text">
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
        </div>
    </section>
  );
}
