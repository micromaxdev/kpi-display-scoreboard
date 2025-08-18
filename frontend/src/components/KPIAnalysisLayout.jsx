import React from 'react';
import { motion } from 'framer-motion';
import {
  PreviewPage as AnalysisPageContainer,
  Container,
  Header,
  Card,
  TopSection,
  SummaryGrid,
  SummaryCard,
  ThresholdInfo,
  DataSection,
  CategoryTabs,
  CategoryTab,
  DataTable,
  TableHeader,
  TableRow,
  TableCell,
  EmptyState
} from '../styles/KpiLayout.styled';

const KPIAnalysisLayout = ({ 
  title, 
  subtitle, 
  analysisData, 
  field, 
  collectionName, 
  actionButtons,
  emptyStateTitle = "No Analysis Data Available",
  emptyStateMessage = "Please configure your threshold settings."
}) => {
  const [activeCategory, setActiveCategory] = React.useState('red');

  if (!analysisData) {
    return (
      <AnalysisPageContainer>
        <Container>
          {actionButtons}
          <Card>
            <EmptyState>
              <div className="icon">📊</div>
              <h3>{emptyStateTitle}</h3>
              <p>{emptyStateMessage}</p>
            </EmptyState>
          </Card>
        </Container>
      </AnalysisPageContainer>
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
    <AnalysisPageContainer>
      <Container>
        <Header>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        </Header>

        {actionButtons}

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
    </AnalysisPageContainer>
  );
};

export default KPIAnalysisLayout;
