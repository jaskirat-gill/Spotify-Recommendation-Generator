import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;


function App() {
  const [accessToken, setAccessToken] = useState("");
  const [RangeInput, setRangeInput] = useState("");
  const [ArtistInput, setArtistInput] = useState("");
  const artistIdArray = [];
  const [SongInput, setSongInput] = useState("");
  const songIdArray = [];
  let recommendations = [];


  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token)) 
  }, [])


  async function generate() {
    console.log("Generating Recommendations! ")

    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    recommendations = await fetch('https://api.spotify.com/v1/recommendations?limit=' + RangeInput + '&seed_artists=' + joinArtistID() 
      + '&seed_tracks=' + joinSongID(), searchParameters)
      .then(response => response.json())
      .then(data => console.log(data))
  

  }

  function joinArtistID() {
    let result = artistIdArray[0];
    for(let i = 1; i < artistIdArray.length; i++) {
      result += '&2C' + artistIdArray[i]
    }
    return result
  }

  function joinSongID() {
    let result = songIdArray[0];
    for(let i = 1; i < songIdArray.length; i++) {
      result += '%2C' + songIdArray[i]
    }
    return result
  }

  async function artistSearch() {
    var artistArray = ArtistInput.split(',');
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    for(let i = 0; i < artistArray.length; i++) {
      artistIdArray[i] = await fetch('https://api.spotify.com/v1/search?q=' + artistArray[i] + '&type=artist', searchParameters)
        .then(response => response.json())
        .then(data => {return data.artists.items[0].id })
    }
    console.log("Artist IDs " + artistIdArray);

  }

  async function songSearch() {
    var songAndArtistArray = SongInput.split(',');
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    for(let i = 0; i < songAndArtistArray.length; i++) {
      songIdArray[i] = await fetch('https://api.spotify.com/v1/search?q=' + songAndArtistArray[i] + '&type=track', searchParameters)
        .then(response => response.json())
        .then(data => {return data.tracks.items[0].id })
    }
    console.log("Song Id's " + songIdArray);

  }



  return (
    <div className='App'>
      <Container>
      <h1 className="display-4">Welcome To The Spotify Recommendations Generator!</h1>
        <div class="row">
          <div class="col-sm">
            <Row className='mx-2 row row-cols-1'>
              Fill Out The Following Fields To Get Recommendations:
              {/* Range Input Field Start*/}
              <label htmlFor="basic-url">Number Of Songs To Generate:</label>
              <InputGroup className='mb-3' size='lg'>
                <FormControl
                placeholder='Integer Between 1-100'
                type='input'
                onChange={event => setRangeInput(event.target.value)}
                />
                <Button>
                  Submit
                </Button>
              </InputGroup>
              {/* Range Input Field End*/}
              {/* Artist Input Field Start*/}
              <label htmlFor="basic-url">Singers To Base Recommendations Off:</label>
              <InputGroup className='mb-3' size='lg'>
                <FormControl
                placeholder='1-5 Singers (Ex. Diljit Dosanjh, Karan Aujla)'
                type='input'
                onKeyPress={event => {
                  if(event.key ==  "Enter") {
                  artistSearch();
                  }
                }}
                onChange={event => setArtistInput(event.target.value)}
                />
                <Button onClick={artistSearch}>
                  Submit
                </Button>
              </InputGroup>
              {/* Artist Input Field End*/}
              {/* Song Input Field Start*/}
              <label htmlFor="basic-url">Songs To Base Recommendations Off In form of (Song Artist):</label>
              <InputGroup className='mb-3' size='lg'>
                <FormControl
                placeholder='1-5 Songs (Ex. G.O.A.T Diljit, Phulkari Balkar Sidhu)'
                type='input'
                onKeyPress={event => {
                  if(event.key ==  "Enter") {
                  songSearch();
                  }
                }}
                onChange={event => setSongInput(event.target.value)}
                />
                <Button onClick={songSearch}>
                  Submit
                </Button>
              </InputGroup>
              {/* Song Input Field End*/}
              <Button onClick={generate}>
              Generate!
              </Button>
            </Row>
          </div>
          <div class="col-sm">
            <Row className='mx-2 row row-cols-1'>
            <Card>
               <Card.Img src='#' />
               <Card.Body>
                 <Card.Title>TEST</Card.Title>
               </Card.Body>
            </Card>
            <Card>
               <Card.Img src='#' />
               <Card.Body>
                 <Card.Title>TEST 2</Card.Title>
               </Card.Body>
            </Card>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
  // return (
  //   <div className="App">
  //     <Container>
  //     <h1 className="display-4">Welcome To The Spotify Recommendations Generator!</h1>
  //       <InputGroup className='mb-3' size='lg'>
  //         <FormControl
  //         placeholder='Search For Artist'
  //         type='input'
  //         onKeyPress={event => {
  //           if(event.key ==  "Enter") {
  //             search();
  //           }
  //         }}
  //         onChange={event => setSearchInput(event.target.value)}
  //         />
  //         <Button onClick={search}>
  //           Search
  //         </Button>
  //       </InputGroup>
  //     </Container>
  //     <Container>
  //       <Row className='mx-2 row row-cols-4'>
  //         {albums.map( (album, i) => {
  //           return (
  //             <Card>
  //             <Card.Img src={album.images[0].url} />
  //             <Card.Body>
  //               <Card.Title>{album.name}</Card.Title>
  //             </Card.Body>
  //         </Card>
  //           )
  //         })}
  //       </Row>
  //     </Container>
  //   </div>
  // );
}

export default App;