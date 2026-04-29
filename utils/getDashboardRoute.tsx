export const getDashboardRoute = (userType: any) => {
    switch (userType) {
        case 'dealer':
            return '/dealer/dashboard';
        case 'showroom':
            return '/showroom/dashboard';
        case 'customer':
            return '/dashboard';
        default:
            return '/';
    }
};