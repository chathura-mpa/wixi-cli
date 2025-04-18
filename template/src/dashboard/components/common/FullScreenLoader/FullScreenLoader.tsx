import React from 'react'
import { Box, Loader, Modal } from '@wix/design-system'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

function FullScreenLoader() {
  const visibility = useSelector((state: RootState) => state.loader.fullLoader);
  return (
    <Modal screen={'full'} isOpen={visibility} onRequestClose={() => { }} zIndex={100000}>
      <Box align="center" padding="30px">
        <Loader size="medium" />
      </Box>
    </Modal>
  )
}

export default FullScreenLoader
