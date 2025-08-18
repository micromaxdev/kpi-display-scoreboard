import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const AnalysisPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const SummaryCard = styled(motion.div)`
  background: ${props => {
    switch(props.$category) {
      case 'green': return 'linear-gradient(135deg, #4CAF50, #45a049)';
      case 'amber': return 'linear-gradient(135deg, #FF9800, #f57c00)';
      case 'red': return 'linear-gradient(135deg, #f44336, #d32f2f)';
      case 'total': return 'linear-gradient(135deg, #2196F3, #1976d2)';
      default: return 'linear-gradient(135deg, #9E9E9E, #757575)';
    }
  }};
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: translateX(0);
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .count {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .percentage {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const ThresholdInfo = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;

  h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.5rem;
  }

  .threshold-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .threshold-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #667eea;

    .label {
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .value {
      font-size: 1.2rem;
      font-weight: 700;
      color: #333;
    }
  }
`;

const DataSection = styled.div`
  h3 {
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.5rem;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  background: ${props => props.$active ? '#667eea' : '#e9ecef'};
  color: ${props => props.$active ? 'white' : '#6c757d'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? '#5a6fd8' : '#dee2e6'};
    transform: translateY(-2px);
  }
`;

const DataTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 600px;
  overflow-y: auto;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 0.8fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  font-size: 0.9rem;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.customer-name {
    font-weight: 500;
  }

  &.amount {
    font-weight: 600;
    color: ${props => props.$negative ? '#dc3545' : '#28a745'};
    font-family: 'Monaco', 'Menlo', monospace;
  }

  &.category {
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      text-align: center;
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      background: ${props => {
        switch(props.$category) {
          case 'green': return '#28a745';
          case 'amber': return '#ffc107';
          case 'red': return '#dc3545';
          default: return '#6c757d';
        }
      }};
    }
  }

  &.comparison {
    font-family: 'Monaco', 'Menlo', monospace;
    font-weight: 500;
    color: ${props => props.$negative ? '#dc3545' : '#28a745'};
  }
`;

const BackButton = styled(motion.button)`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: #495057;
  }
`;

const KPIAnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState('red');
  
  // Get analysis data from navigation state
  const { analysisData, field, collectionName } = location.state || {};
  
  const handleBackToForm = () => {
    navigate('/');
  };

  if (!analysisData) {
    return (
      <AnalysisPage>
        <Container>
          <BackButton
            onClick={handleBackToForm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Form
          </BackButton>
          <Card>
            <EmptyState>
              <div className="icon">📊</div>
              <h3>No Analysis Data Available</h3>
              <p>Please go back to the form and submit your threshold configuration.</p>
            </EmptyState>
          </Card>
        </Container>
      </AnalysisPage>
    );
  }

  const { collection, thresholds, countsByCategory, topItems } = analysisData;
  const totalCount = countsByCategory.total;

  const getPercentage = (count) => {
    return totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0';
  };

  const categories = ['red', 'amber', 'green'];
  const categoryLabels = {
    red: 'Critical Issues',
    amber: 'Needs Attention', 
    green: 'Good Performance'
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AnalysisPage>
      <Container>
        <Header>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            KPI Analysis Results
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Collection: {collection} | Field: {field || 'N/A'}
          </motion.p>
        </Header>

        <BackButton
          onClick={handleBackToForm}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          ← Back to Form
        </BackButton>

        <TopSection>
          {/* Left side - Summary Cards */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.5rem' }}>Performance Overview</h3>
            <SummaryGrid>
              <SummaryCard
                $category="total"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3>Total Records</h3>
                <div className="count">{countsByCategory.total.toLocaleString()}</div>
                <div className="percentage">100%</div>
              </SummaryCard>

              <SummaryCard
                $category="green"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3>Green</h3>
                <div className="count">{countsByCategory.green.toLocaleString()}</div>
                <div className="percentage">{getPercentage(countsByCategory.green)}%</div>
              </SummaryCard>

              <SummaryCard
                $category="amber"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3>Amber</h3>
                <div className="count">{countsByCategory.amber.toLocaleString()}</div>
                <div className="percentage">{getPercentage(countsByCategory.amber)}%</div>
              </SummaryCard>

              <SummaryCard
                $category="red"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <h3>Red</h3>
                <div className="count">{countsByCategory.red.toLocaleString()}</div>
                <div className="percentage">{getPercentage(countsByCategory.red)}%</div>
              </SummaryCard>
            </SummaryGrid>
          </Card>

          {/* Right side - Threshold Info */}
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ThresholdInfo>
              <h3>Threshold Configuration</h3>
              <div className="threshold-grid">
                <div className="threshold-item">
                  <div className="label">Collection</div>
                  <div className="value">{collection}</div>
                </div>
                <div className="threshold-item">
                  <div className="label">Field</div>
                  <div className="value">{field}</div>
                </div>
                <div className="threshold-item">
                  <div className="label">Green Threshold</div>
                  <div className="value">{thresholds.green}</div>
                </div>
                <div className="threshold-item">
                  <div className="label">Amber Threshold</div>
                  <div className="value">{thresholds.amber}</div>
                </div>
                <div className="threshold-item">
                  <div className="label">Direction</div>
                  <div className="value">{thresholds.direction === 'lower' ? 'Lower is Better' : 'Higher is Better'}</div>
                </div>
              </div>
            </ThresholdInfo>
          </Card>
        </TopSection>

        {/* Bottom section - Data Table */}
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <DataSection>
            <h3>Detailed Records</h3>
            
            <CategoryTabs>
              {categories.map(category => (
                <CategoryTab
                  key={category}
                  $active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {categoryLabels[category]} ({countsByCategory[category]})
                </CategoryTab>
              ))}
            </CategoryTabs>

            <DataTable>
              {topItems[activeCategory] && topItems[activeCategory].length > 0 ? (
                <>
                  <TableHeader>
                    <div>Customer</div>
                    <div>Doc No</div>
                    <div>Doc Date</div>
                    <div>Due Date</div>
                    <div>Amount</div>
                    <div>Category</div>
                    <div>Score</div>
                  </TableHeader>
                  {topItems[activeCategory].map((item, index) => (
                    <TableRow
                      key={`${item.docNo}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <TableCell className="customer-name">
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.customerCode}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.customerName}>
                          {item.customerName}
                        </div>
                      </TableCell>
                      <TableCell>{item.docNo || '-'}</TableCell>
                      <TableCell>{formatDate(item.docDate)}</TableCell>
                      <TableCell>{formatDate(item.dueDate)}</TableCell>
                      <TableCell className="amount" $negative={item.amount < 0}>
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell className="category" $category={item.ragCategory}>
                        <span className="badge">{item.ragCategory}</span>
                      </TableCell>
                      <TableCell className="comparison" $negative={item.comparisonValue < 0}>
                        {item.comparisonValue || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <EmptyState>
                  <div className="icon">📄</div>
                  <h3>No {categoryLabels[activeCategory]} Records</h3>
                  <p>No records found in this category.</p>
                </EmptyState>
              )}
            </DataTable>
          </DataSection>
        </Card>
      </Container>
    </AnalysisPage>
  );
};

export default KPIAnalysisPage;
