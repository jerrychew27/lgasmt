import React, { useState, useEffect } from 'react';


function App() {

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [selectCategory, setCategory] = useState('');
    
  // Fetch data from a mock API
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
      setError(error); // set the error message to the state
    });

  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value); // this updates the state with the selected category
  };

  // Filter posts based on the selected category
  const filteredPosts = selectCategory 
    ? posts.filter(post => 
      post.categories.some(category => category.name === selectCategory))
       : posts;

  const categories = Array.from(new Set(posts.flatMap(post => post.categories.map(category => category.name))));

  return (
    <div>
      <h1>Posts</h1>
      {error && <p>Error: {error.message}</p>}

      {/* Dropdown to filter posts by category */}
      <label htmlFor="category-filter">Filter by category:</label>
      <select id="category-filter" value={selectCategory} onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
            </option>
        ))}
      </select>

      {filteredPosts.length > 0 ? (
        <ul className="no-bullets">
          {filteredPosts.map(post => (
            <li key={post.id} style={{ marginBottom: '20px', padding: '10px', border: '5px solid #ccc' }}>
              <h2>{post.title}</h2>
              <p><strong>Published on:</strong> {new Date(post.publishDate).toLocaleDateString()}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={post.author.avatar} alt={`${post.author.name} avatar`} style={{ borderRadius: '50%', marginRight: '10px' }} />
                <p><strong>Author:</strong> {post.author.name}</p>
              </div>
              <p><strong>Summary:</strong> {post.summary}</p>
              <div>
                <strong>Categories:</strong>
                <ul>
                  {post.categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found for the selected cateogyr</p>
      )}
    </div>
  );
  }

export default App;
