import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FiCheck } from 'react-icons/fi';

export default function CheckToDepositTable({ handleMarkAsDeposited, state }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    state.selectedStore &&
    state.undepositedChecks.length > 0 && (
      <div className='space-y-3 md:space-y-4'>
        <h3 className='text-base md:text-lg font-medium text-gray-800'>
          Checks to Withdraw ({state.undepositedChecks.length})
        </h3>
        <TableContainer
          component={Paper}
          className='shadow-sm'
          sx={{ minWidth: '100%' }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: '#15803d' }}>
              <TableRow>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'medium',
                    fontSize: isMobile && '0.65rem',
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 1 : 2,
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'medium',
                    fontSize: isMobile && '0.65rem',
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 1 : 2,
                  }}
                >
                  Check #
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'medium',
                    fontSize: isMobile && '0.65rem',
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 1 : 2,
                  }}
                >
                  Company
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'medium',
                    fontSize: isMobile && '0.65rem',
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 1 : 2,
                  }}
                >
                  Amount
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 'medium',
                    fontSize: isMobile && '0.65rem',
                    py: isMobile ? 1 : 1.5,
                    px: isMobile ? 1 : 2,
                  }}
                >
                  Mark Deposited
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.undepositedChecks.map((check) => (
                <TableRow
                  key={check.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: isMobile && '0.75rem',
                      py: isMobile ? 1 : 1.5,
                      px: isMobile ? 1 : 2,
                    }}
                  >
                    {new Date(check.date).toLocaleDateString('en-US', {
                      month: isMobile ? 'numeric' : 'short',
                      day: 'numeric',
                      year: isMobile ? '2-digit' : 'numeric',
                    })}
                  </TableCell>
                  <TableCell
                    component='th'
                    scope='row'
                    sx={{
                      fontWeight: 'bold',
                      fontSize: isMobile && '0.75rem',
                      py: isMobile ? 1 : 1.5,
                      px: isMobile ? 1 : 2,
                    }}
                  >
                    {check.checkNumber}
                  </TableCell>
                  <TableCell
                    component='th'
                    scope='row'
                    sx={{
                      fontSize: isMobile && '0.75rem',
                      py: isMobile ? 1 : 1.5,
                      px: isMobile ? 1 : 2,
                    }}
                  >
                    {check.company}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: isMobile && '0.75rem',
                      py: isMobile ? 1 : 1.5,
                      px: isMobile ? 1 : 2,
                    }}
                  >
                    ${check.amount.toFixed(2)}
                  </TableCell>

                  <TableCell
                    sx={{
                      py: isMobile ? 1 : 1.5,
                      px: isMobile ? 1 : 2,
                      textAlign: isMobile && 'center',
                    }}
                  >
                    <Button
                      variant='contained'
                      size={isMobile ? 'small' : 'medium'}
                      startIcon={!isMobile && <FiCheck size={14} />}
                      onClick={() => handleMarkAsDeposited(check.id)}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: 'var(--color-green-600)',
                        ':hover': {
                          backgroundColor: 'var(--color-green-700)',
                        },
                      }}
                    >
                      {isMobile ? <FiCheck size={14} /> : 'Deposited'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  );
}
