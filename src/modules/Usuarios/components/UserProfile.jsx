import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const UserProfile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 60, height: 60 }}>
                        {user.nombre?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">
                            {user.nombre} {user.apellido}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user.rol}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
