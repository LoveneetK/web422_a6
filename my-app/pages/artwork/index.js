import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Row, Col, Pagination } from 'react-bootstrap';
import ArtworkCard from '@/components/ArtworkCard';
import Error from 'next/error';
import validObjectIDList from '@/public/data/validObjectIDList'

const PER_PAGE=12;

export default function Artwork(){
    const [artworkList, setArtworkList] = useState(null);
    const [page, setPage]=useState(1);

    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];

    const{data, error}=useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

    function previousPage(){
       setPage(prevPage=>prevPage>1?prevPage-1:prevPage);
    };

    function nextPage(){
        setPage(prevPage=>prevPage<artworkList.length?prevPage+1:prevPage)
    };

    useEffect(()=>{
        if(data){
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            const results=[];
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }            
              setArtworkList(results);
              setPage(1);
        }
    },[data]);

    if(error){
        return <Error statusCode={404} />;
    }

    if(!artworkList){
        return null;
    }

    return (
        <>
        <Row className="gy-4">
        {artworkList.length>0?(
            <>
                {artworkList[page-1].map((currentObjectID)=>(
                    <Col lg={3} key={currentObjectID}>
                        <ArtworkCard objectID={currentObjectID} />
                    </Col>
                ))}
            </>
            
        ):(
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for something else.
          </Card.Body>
        </Card>
        )}
        </Row>

        {artworkList.length > 0 && (
            <Row className="justify-content-left my-4">
                <Col xs="auto">
                    <Pagination>
                        <Pagination.Prev onClick={previousPage} />
                        <Pagination.Item active>{page}</Pagination.Item>
                        <Pagination.Next onClick={nextPage}  />
                    </Pagination>
                </Col>
            </Row>
        )}
        </>
    );


};
