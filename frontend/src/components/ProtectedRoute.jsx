import { CircularProgress } from '@mui/material'
import { Outlet, Navigate } from 'react-router-dom'
import { valid } from '../api/authApi'
import React, { useState, useEffect } from 'react';
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute() {
    const { authState } = useContext(AuthContext)

    if (authState === null) return <CircularProgress color="inherit" />
    if (authState === true) return <Outlet />
    return <Navigate to="/login" />
}