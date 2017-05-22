import React, { Component, PropTypes } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import Panel from 'react-bootstrap/lib/Panel';

import { getCaption } from 'utils/DataUtils';

const messages = defineMessages({
  images: {
    id: 'imagepanel.images',
    defaultMessage: 'Kuvat',
  },
});

class ImagePanel extends Component {
  constructor(props) {
    super(props);
    this.renderImage = this.renderImage.bind(this);
  }

  renderImage(image, index) {
    const alt = getCaption(image) || this.props.altText;
    const src = image.url;
    const imageStyles = {
      width: '100%',
      marginTop: index > 0 ? '15px' : 0,
    };

    return (
      <img
        alt={alt}
        key={image.url}
        src={src}
        style={imageStyles}
      />
    );
  }

  render() {
    const { images, intl } = this.props;

    if (!images.length) {
      return null;
    }

    return (
      <Panel
        collapsible
        id="image-panel"
        header={intl.formatMessage(messages.images)}
      >
        {images.map(this.renderImage)}
      </Panel>
    );
  }
}

ImagePanel.propTypes = {
  altText: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ImagePanel);
