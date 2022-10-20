import React from 'react';
import renderer from 'react-test-renderer';
import TextField from './TextField';

test('Render TextField', () => {
  const component = renderer.create(
    <TextField label='test text field'/>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
