import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Link, useSearchParams } from 'react-router-dom';
import './App.scss';

function App() {

  // declaring the state variables
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [postsPerPage] = useState(6);
   
  // using useSearchParams to handle the query string
  const [searchParams, setSearchParams] = useSearchParams();

  // getting the category and page number from the query string
  const selectCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
 

  // fetch data from a mock API
  useEffect(() => {
    fetch('/api/posts')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      setPosts(data.posts); // set the fetched data from the mock API to the state
    })
    .catch(error => {
      setError(error); // set the error message of the state if there is an error
    });
  }, []);

  // implementing a single select category filter and added persist filter state in query string using useSearchParams
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSearchParams({ category: newCategory, page: '1' });
    window.scrollTo(0, 0); // scroll to the top of the page when a new category is selected
  };

  // filter posts based on the selected category
  const filteredPosts = selectCategory 
    ? posts.filter(post => 
      post.categories.some(category => category.name === selectCategory))
       : posts;

  // get the unique categories from the posts
  const categories = Array.from(new Set(posts.flatMap(post => post.categories.map(category => category.name))));

  // get the current posts based on the current page
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredPosts.slice(firstPostIndex, lastPostIndex);
  
  // pagination function
  const paginate = (pageNumber) => {
    setSearchParams({ category: selectCategory, page: pageNumber.toString() }); // update URL
    window.scrollTo(0, 0); // scroll to the top of the page when a new page is selected
  }

  // output the data from the mock API, and added details button, category filter, and pagination
  return (
    <main>
      <header>
        <h1 className="post-header">POSTS</h1>
      </header>

      {error && <p>Error: {error.message}</p>}

      {/* details button that links to the details page */}
      <section className="details-container">
        <Link to="/details">
        <button className="details-button">Details</button>
        </Link>
      </section>

      {/* dropdown menu section to filter posts by category */}
      <section>
        <label htmlFor="category-filter" className="category-label">Filter by category: </label> 
        <select id="category-filter" value={selectCategory} onChange={handleCategoryChange}>
          <option value=""> All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
            </option>
        ))}
        </select>
      </section>

      {/* listing the posts section with added transition */}
      <section>
        {currentPosts.length > 0 ? (
          <TransitionGroup className="posts-list">
            {currentPosts.map(post => (
              <CSSTransition 
              key={post.id} 
              timeout={300} 
              classNames="fade"
              >
              <article key={post.id} >
                <h2>{post.title}</h2>
                <p><strong>Published on:</strong> {new Date(post.publishDate).toLocaleDateString()}</p>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img className="image-container" src={post.author.avatar} alt={`${post.author.name} avatar`} />
                  <p><strong>Author:</strong> {post.author.name}</p>
                </div>
                <p><strong>Summary:</strong> {post.summary}</p>

                {/* display the categories of the post section */}
                <section>
                  <strong>Categories:</strong>
                  <ul>
                    {post.categories.map(category => (
                      <li key={category.id}>{category.name}</li>
                    ))}
                  </ul>
                </section>
              </article>
              </CSSTransition>
            ))}
            </TransitionGroup>
          ) : (
            <p>No posts found for the selected category</p>
          )}
      </section>

      {/* pagination */}
      <nav className="pagination-container">
        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, i) => (
          <button 
            key={i + 1} 
            onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </nav>
    </main>
    
    );
  }

export default App;
