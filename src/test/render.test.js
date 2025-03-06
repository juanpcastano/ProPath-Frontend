import { render } from '@testing-library/react';
import Loading from '../Components/Loading';

test('renderiza el componente sin errores', () => {
  render(<Loading />);
});