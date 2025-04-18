import React from 'react'

import classes from './Pressable.module.scss'

interface PressableProps {
  children: React.ReactNode
  onClick: () => void
}

const Pressable: React.FC<PressableProps> = ({ children, onClick }) => {
  return (
    <button className={classes['pressable']} onClick={onClick}>
      {children}
    </button>
  )
}

export default Pressable
