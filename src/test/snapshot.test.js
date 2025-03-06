import { render } from '@testing-library/react';
import Loading from '../Components/Loading';

test('compara el snapshot del componente', () => {
  const { asFragment } = render(<Loading />);
  expect(asFragment()).toMatchSnapshot();
});
