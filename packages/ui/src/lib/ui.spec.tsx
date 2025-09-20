import { render } from '@testing-library/react';

import EdubotOneUi from './ui';

describe('EdubotOneUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EdubotOneUi />);
    expect(baseElement).toBeTruthy();
  });
});
