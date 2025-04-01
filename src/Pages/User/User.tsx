import { useParams } from 'react-router-dom';

const User = () => {
  const { id } = useParams();

  return (
    <div>Infomación de usuario {id}</div>
  )
}
export default User