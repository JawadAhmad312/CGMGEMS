import { Link } from 'react-router-dom';
import './Home.css';
import Card from '../Card/Card';
import Womencategory from '../Womencategory/Womencategory';
import Mencategory from '../Mencategory/Mencategory';
import Engagement from '../Engagement/Engagement.jsx';
import Map from '../Map/Map.jsx';
import CollectionsPage from '../pages/CollectionsPage.jsx';

function Home() {
  return (
    <main className="luxury-home">
      <section className="gem-hero">
        <div className="gem-hero__content">
          <h1>Create Your Dream Design</h1>
          <p className="gem-hero__copy">Experience the joy of creating bespoke gemstone jewelry with our design-your-own service, where your dreams become reality through personalized craftsmanship.</p>
          <div className="gem-hero__actions">
            <Link className="gem-button " to="/Stone">Start designing <span aria-hidden="true" className='mb-3' >⌄</span></Link>
          </div>
        </div>
        <div className="gem-hero__image">
          <img src="/images/homebanner.png" alt="A curated selection of natural gemstones" />
        </div>
      </section>

      <section className="gem-intro section-shell">
        <p className="gem-eyebrow">The Swati Gemz difference</p>
        <h2>Made by nature.<br />Chosen with care.</h2>
        <p>We believe a gemstone should feel personal. Explore authentic stones selected for their beauty, character and exceptional quality, with considered guidance at every step.</p>
        <Link className="gem-text-link" to="/AboutUs">Our story <span>→</span></Link>
      </section>

      <section className="section-shell featured-stones">
        <div className="section-heading"><div><p className="gem-eyebrow">Selected for you</p><h2>Featured gemstones</h2></div><Link className="gem-text-link hide-on-mobile" to="/Stone">View all stones <span>→</span></Link></div>
        <Card />
        <div className="mobile-action"><Link className="gem-text-link" to="/Stone">View all stones <span>→</span></Link></div>
      </section>

      <section className="design-feature">
        <div className="design-feature__image">
          <img src="/images/Ring_Truly.webp" alt="Emerald engagement ring on a marble display" />
          <span className="design-feature__image-note">01 / Bespoke service</span>
        </div>
        <div className="design-feature__content">
          <p className="gem-eyebrow">Create something personal</p>
          <h2 className='text-2xl '>Design<br />your own<br />timeless<br />piece</h2>
          <p>Begin with a remarkable gemstone or a beautiful setting. Our team will help bring your vision to life with a piece made just for you.</p>
          <div className="design-feature__links">
            <Link className="gem-button" to="/Stone">Start with a stone <span aria-hidden="true">↗</span></Link>
            <Link className="gem-text-link" to="/collections/womenrings">Start with a setting <span>→</span></Link>
          </div>
        </div>
      </section>

      <CollectionsPage />
      <section className="promise-strip"><div><strong>Natural &amp; authentic</strong><span>Carefully selected stones</span></div><div><strong>Expert guidance</strong><span>Personal help when you need it</span></div><div><strong>Secure delivery</strong><span>Across Pakistan</span></div></section>
      <Womencategory /><Mencategory /><Map /><Engagement />
    </main>
  );
}

export default Home;
