import React, { useCallback, useEffect, useState } from 'react';
import { Box, Text, TextButton } from '@wix/design-system';

type RefreshButtonProps = {
  onClick: () => void;
};

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick }) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date()); // Initialize immediately
  const [timeSinceRefresh, setTimeSinceRefresh] = useState<string>('now');

  const updateTimeSinceRefresh = useCallback(() => {
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);

    if (secondsAgo < 60) {
      setTimeSinceRefresh(`${secondsAgo} second${secondsAgo !== 1 ? 's' : ''} ago`);
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      setTimeSinceRefresh(`${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`);
    } else {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      setTimeSinceRefresh(`${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`);
    }
  }, [lastRefresh]);

  // Set up interval to update time since last refresh
  useEffect(() => {
    const interval = setInterval(updateTimeSinceRefresh, 10000); // Update every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount or when lastRefresh changes
  }, [updateTimeSinceRefresh]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    const now = new Date();
    setLastRefresh(now);
    setTimeSinceRefresh('now');
    onClick();
  }, [onClick]);

  return (
    <Box verticalAlign="middle" gap={0.5}>
      <Text size="tiny">Updated {timeSinceRefresh}</Text>
      <TextButton size="tiny" onClick={handleRefresh}>
        Refresh
      </TextButton>
    </Box>
  );
};

export default RefreshButton;