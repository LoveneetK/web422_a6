import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import styles from '@/styles/History.module.css';
import { Card } from "react-bootstrap";
import { ListGroup,Button } from "react-bootstrap";
import { removeFromHistory } from "@/lib/userData";

export default function History() {
    const[searchHistory,setSearchHistory]=useAtom(searchHistoryAtom);
    const router=useRouter();
    if(!favouritesList) return null;

    let parsedHistory = [];

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    let historyClicked=(e,index)=>{
        e.stopPropagation();
        router.push(`/artwork/${searchHistory[index]}`);
    };

    async function removeHistoryClicked(e,index){
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]));
    }

    return (
        <>
        {parsedHistory.length>0?(
            <ListGroup className="mt-3">
            {parsedHistory.map((historyItem, index) => (
              <ListGroup.Item
              key={index}
              className={styles.historyListItem}
              onClick={(e) => historyClicked(e, index)}
            >
              {Object.keys(historyItem).map((key) => (
                <span key={key}>
                  {key}:{' '}
                  <strong>{historyItem[key]}</strong>&nbsp;
                </span>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
            
            ))}
          </ListGroup>

        ):(
        <Card>
            <Card.Body>
              <h4>Nothing Here</h4>
              Try adding some new artwork to the list.
            </Card.Body>
        </Card>
        )}
        </>
    )
  }