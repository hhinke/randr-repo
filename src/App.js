import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [repo, setRepo] = useState(null);

  useEffect(() => {
    async function loadRandomRepo() {
      // generate random repo id
      var repoId = Math.floor((Math.random() * 50000) + 1);
      const reposResponse = await axios.get(`https://api.github.com/repositories?since=${repoId}`);

      if(reposResponse.data.length > 0) {        
        // read only first item of response
        const { full_name, description, html_url, languages_url, owner: { avatar_url },  } = reposResponse.data[0];
        const languageResponse = await axios.get(languages_url);

        setRepo({
          full_name,
          url: html_url,
          description,
          avatar_url,
          languages: Object.keys(languageResponse.data)
        });
      }
    }

    loadRandomRepo();
  },[]); 

  return (
    <div className="main-container">
      { repo !== null ? (
        <p> 
          <img src={repo.avatar_url} alt={repo.full_name} />
          <strong>{repo.full_name}</strong>
          { repo.languages.length > 0 && (
            <ul class="tags">
              {repo.languages.map(language => (
                  <li><a href="#" class="tag">{language}</a></li>
              ))}
            </ul>
          ) }
          <p className="description">{repo.description}</p>

          <div className="buttons">
            <a href={repo.url}>
              <button type="button">Go!</button>
            </a>
          </div>
        </p>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
}