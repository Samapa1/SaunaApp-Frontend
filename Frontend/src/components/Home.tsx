 import { Link } from "react-router-dom";
 import ListGroup from 'react-bootstrap/ListGroup';

 const Home = () => {
   return (
        <ListGroup>
          <ListGroup.Item><Link to="/">Home</Link></ListGroup.Item>
          <ListGroup.Item><Link to="/sauna1">Sauna 1</Link></ListGroup.Item>
          <ListGroup.Item><Link to="/sauna2">Sauna 2</Link></ListGroup.Item>
          <ListGroup.Item><Link to="/sauna3">Sauna 3</Link></ListGroup.Item>
          <ListGroup.Item><Link to="/sauna4">Sauna 4</Link></ListGroup.Item>
          <ListGroup.Item><Link to="/sauna5">Sauna 5</Link></ListGroup.Item>
       </ListGroup>
   );
 }

 export default Home

