export default function NewListingPage() {
  return (
    <div className="stack">
      <header>
        <p className="brand-kicker">Listings</p>
        <h1 className="page-title">Create listing</h1>
        <p className="subtle">A scaffolded intake form for future moderation workflows.</p>
      </header>

      <section className="card">
        <form className="form-grid">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" placeholder="3 bedroom house in Nugegoda" />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status">
              <option>Draft</option>
              <option>Pending review</option>
              <option>Active</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="propertyType">Property type</label>
            <select id="propertyType" name="propertyType">
              <option>House</option>
              <option>Apartment</option>
              <option>Land</option>
              <option>Commercial</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="price">Price</label>
            <input id="price" name="price" placeholder="180000" />
          </div>
          <div className="field span-2">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="Add listing details..." />
          </div>
        </form>
      </section>
    </div>
  );
}
