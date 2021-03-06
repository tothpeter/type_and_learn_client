import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-upload', 'Integration | Component | file upload', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('url', "/import");

  this.render(hbs`{{file-upload url=url}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#file-upload url=url}}
      template block text
    {{/file-upload}}
  `);

  assert.equal(this.$().text().trim(), 'template block text', 'Display the content of the given block');
});
