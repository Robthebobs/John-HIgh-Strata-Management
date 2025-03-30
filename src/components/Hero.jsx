import house from '../assets/Green1.avif';
import pool from '../assets/Green2.avif';
import kitchen from '../assets/green3.avif';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Welcome to<br /><span className="highlight">John High</span></h1>
        <p>Welcome to John High, a vibrant and well-managed residential community in the heart of Sydney.</p>
        <p>Our strata committee is committed to ensuring a safe, well-maintained, and friendly environment for all residents.</p>
        <p>Stay connected. Stay informed. Welcome home!</p>
      </div>
      <div className="hero-image">
        <div className="image-collage">
          <img src={house} alt="1s" className="collage-img img1" />
          <img src={pool} alt="2s" className="collage-img img2" />
          <img src={kitchen} alt="3s" className="collage-img img3" />
        </div>
      </div>
    </section>
  );
};

export default Hero; 