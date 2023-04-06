import useSWR from "swr";
import Link from "next/link";
import { Card, Button } from "react-bootstrap";
import { useState } from "react";

export default function ArtworkCard({ objectID }) {
  const [hasError, setHasError] = useState(false);

  const { data } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
    {
      revalidateOnFocus: false,
      onError: () => setHasError(true),
    }
  );

  if (hasError) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    objectID: id,
    primaryImageSmall: image,
    title,
    objectDate,
    classification,
    medium,
  } = data;

  return (
    <>
    <br />
      <Card >
        <Card.Img
          variant="top"
          src={
            image
              ? image
              : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"
          }
          alt={title}
        />
        <Card.Body>
          <Card.Title>{title ? title : "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date:</strong> {objectDate ? objectDate : "N/A"} <br />
            <strong>Classification:</strong>{" "}
            {classification ? classification : "N/A"} <br />
            <strong>Medium:</strong> {medium ? medium : "N/A"} <br />
          </Card.Text>
          <Link href={`/artwork/${objectID}`} passHref>
            <Button variant="primary">{objectID}</Button>
          </Link>
        </Card.Body>
      </Card>
    </>
  );
}
