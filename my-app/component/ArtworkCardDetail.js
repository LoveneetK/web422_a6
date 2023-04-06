import useSWR from "swr";
import Link from "next/link";
import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";


export default function ArtworkCardDetail({objectID}){
    const [hasError, setHasError] = useState(false);
    const [favouritesList, setFavouritesList]=useAtom(favouritesAtom);
    const [showAdded,setShowAdded]=useState(false) //
    const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);


    if (hasError) {
        return <Error statusCode={404} />;
    }

    if(!data) {
        return null;
    }

    const {
        primaryImage,
        title,
        objectDate,
        classification,
        medium,
        artistDisplayName,
        artistWikidata_URL,
        creditLine,
        dimensions,
      } = data;
    
    async function favouritesClicked(){
      if(showAdded){
        setFavouritesList(await removeFromFavourites(objectID)) 
        // setShowAdded(false);
      }else{
        setFavouritesList(await addToFavourites(objectID))
        // setShowAdded(true);
      }
      
    }

    useEffect(()=>{
      setShowAdded(favouritesList?.includes(objectID))
  }, [favouritesList])
  
    

    
    return (
        <>
        <br />
         <Card >
         {primaryImage && (
        <Card.Img src={primaryImage} alt={title} />
      )}
      <Card.Body>
        <Card.Title>{title ? title : "N/A"}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate ? objectDate : "N/A"} <br />
          <strong>Classification:</strong> {classification ? classification : "N/A"} <br />
          <strong>Medium:</strong> {medium ? medium : "N/A"} <br /><br />
          <strong>Artist: </strong>{artistDisplayName ? artistDisplayName : "N/A"} 
          {artistDisplayName &&
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">(wiki)</a>
          }
          <br />
          <strong>Credit Line: </strong>{creditLine ? creditLine : "N/A"} <br />
          <strong>Dimensions: </strong>{dimensions ? dimensions : "N/A"} <br />
          <Button variant={showAdded?'primary':'outline-primary'} onClick={favouritesClicked}>
            {showAdded?'+ Favourite (added)':'+ Favourite'}
          </Button>
        </Card.Text>
      </Card.Body>
    </Card>
        </>
    )

}