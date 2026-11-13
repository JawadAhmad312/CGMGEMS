const AnnouncementBar = () => {
  return (
    <div className="catalog-topbar">
      <div className="catalog-topbar__links">
        <a href="/Stone">◆ <span>Rubies</span></a>
        <a href="/Stone">◆ <span>Emeralds</span></a>
        <a href="/Stone">◆ <span>Sapphires</span></a>
        <a href="/Stone">◆ <span>Gemstones</span></a>
      </div>
      <div className="catalog-topbar__contact">
        <span>+1-212-804-9994</span>
        <a href="/ContactUs">CONTACT US <span aria-hidden="true">⌄</span></a>
      </div>

    </div>
  );
};

export default AnnouncementBar;
