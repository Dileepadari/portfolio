-- Sample blog posts data for the portfolio
-- Run this in your Supabase SQL editor to populate the blog_posts table

INSERT INTO blog_posts (
  title,
  slug,
  content,
  excerpt,
  external_link,
  tags,
  published,
  order_index,
  image_url
) VALUES 
(
  'Building Scalable React Applications: Lessons from Production',
  'building-scalable-react-applications-lessons-from-production',
  'This is a comprehensive guide about React scalability patterns...',
  'After building several large-scale React applications, I''ve learned valuable lessons about architecture, state management, and performance optimization that I want to share with fellow developers.',
  'https://react.dev/learn/thinking-in-react',
  ARRAY['React', 'Architecture', 'Performance', 'Best Practices', 'Frontend Development'],
  true,
  1,
  null
),
(
  'My Journey from Computer Science Student to Full-Stack Developer',
  'my-journey-from-computer-science-student-to-full-stack-developer',
  'Looking back at my journey from a computer science student to a full-stack developer, I realize how much the landscape has changed and how much I''ve grown. This post is for current students and aspiring developers who want to understand what the transition looks like.

## The Academic Foundation

My B.Tech in Computer Science provided me with crucial fundamentals:
- Data structures and algorithms
- Object-oriented programming principles
- Database design and management
- Software engineering practices
- Computer networks and systems

These weren''t just theoretical concepts—they became the building blocks for everything I do today.

## The Gap Between Academia and Industry

However, I quickly realized there was a significant gap between what I learned in college and what the industry expected:

### Technical Skills Gap
- Modern frameworks and libraries weren''t covered
- Cloud technologies were barely mentioned
- DevOps practices were entirely new
- API design and microservices architecture
- Real-world debugging and problem-solving

### Soft Skills Development
- Code reviews and collaboration
- Project management and deadlines
- Client communication
- Agile methodologies

## Bridging the Gap

Here''s how I approached filling these gaps:

### 1. Personal Projects
I built numerous side projects to experiment with new technologies:
- A task management app using React and Node.js
- A real-time chat application with Socket.io
- A REST API with authentication and authorization
- A mobile app using React Native

### 2. Open Source Contributions
Contributing to open source projects taught me:
- How to read and understand large codebases
- Proper git workflow and collaboration
- Code quality standards
- Community interaction

### 3. Continuous Learning
- Online courses and tutorials
- Technical blogs and documentation
- Attending meetups and conferences
- Following industry leaders on social media

## Key Learnings

### Technical Growth
- **Start with the basics**: Master HTML, CSS, and JavaScript before jumping to frameworks
- **Pick a stack and go deep**: Don''t try to learn everything at once
- **Practice consistently**: Build something every day, even if it''s small
- **Learn by doing**: Theory is important, but practical experience is invaluable

### Career Development
- **Build a portfolio**: Showcase your work with live demos and code repositories
- **Network actively**: Attend local meetups and online communities
- **Seek feedback**: Don''t be afraid to ask for code reviews and advice
- **Stay humble**: There''s always more to learn

## Current Stack and Interests

Today, I work primarily with:
- **Frontend**: React, TypeScript, Next.js, Tailwind CSS
- **Backend**: Node.js, Python, PostgreSQL, MongoDB
- **DevOps**: Docker, AWS, CI/CD pipelines
- **Mobile**: React Native, Flutter

I''m particularly interested in:
- Machine learning applications in web development
- Serverless architectures
- Progressive Web Apps
- Performance optimization

## Advice for Current Students

1. **Don''t wait for permission**: Start building projects now
2. **Focus on problem-solving**: Technology changes, but problem-solving skills are timeless
3. **Build in public**: Share your learning journey and projects
4. **Find mentors**: Connect with developers who inspire you
5. **Embrace failure**: Every bug is a learning opportunity

## Conclusion

The transition from student to professional developer is challenging but incredibly rewarding. The key is to remain curious, keep building, and never stop learning. The industry evolves rapidly, but with strong fundamentals and a growth mindset, you can adapt to any change.

Remember, everyone''s journey is different. Focus on your own path, celebrate small wins, and don''t compare yourself to others. The most important step is the first one—so start building today!',
  'Sharing my experiences, challenges, and learnings during my B.Tech in Computer Science and how I transitioned into professional development. A guide for current students and aspiring developers.',
  null,
  ARRAY['Career', 'Education', 'Personal Growth', 'Computer Science', 'Student Life'],
  true,
  2,
  null
),
(
  'Understanding Machine Learning Algorithms: A Practical Guide',
  'understanding-machine-learning-algorithms-practical-guide',
  'External content - this links to a comprehensive ML guide on Medium.',
  'Deep dive into popular ML algorithms with practical examples and implementation details for computer science students and developers getting started with machine learning.',
  'https://medium.com/@yourprofile/machine-learning-guide',
  ARRAY['Machine Learning', 'Python', 'Algorithms', 'Data Science', 'AI'],
  true,
  3,
  null
),
(
  'Optimizing Database Queries: PostgreSQL Performance Tips',
  'optimizing-database-queries-postgresql-performance-tips',
  'Database performance can make or break your application. After working with PostgreSQL in production environments, I''ve learned valuable techniques for optimizing queries and improving overall database performance.

## Understanding Query Performance

Before optimizing, you need to understand how PostgreSQL executes queries and where bottlenecks occur.

### Using EXPLAIN and EXPLAIN ANALYZE

The most important tools for query optimization:

```sql
-- See the query plan
EXPLAIN SELECT * FROM users WHERE email = ''user@example.com'';

-- See actual execution statistics
EXPLAIN ANALYZE SELECT * FROM users WHERE email = ''user@example.com'';

-- More detailed analysis
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE email = ''user@example.com'';
```

Key metrics to watch:
- **Cost**: PostgreSQL''s estimate of query expense
- **Rows**: Expected vs. actual row counts
- **Time**: Actual execution time
- **Buffers**: Memory usage patterns

## Indexing Strategies

Proper indexing is crucial for query performance.

### B-tree Indexes (Default)
```sql
-- Basic index
CREATE INDEX idx_users_email ON users(email);

-- Composite index
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Partial index
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

### Specialized Index Types

**GIN Indexes for JSON and Arrays:**
```sql
-- For JSONB columns
CREATE INDEX idx_user_metadata ON users USING gin(metadata);

-- For array columns
CREATE INDEX idx_user_tags ON users USING gin(tags);
```

**GiST Indexes for Full-Text Search:**
```sql
-- Create tsvector column
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- Update the column
UPDATE articles SET search_vector = to_tsvector(''english'', title || '' '' || content);

-- Create index
CREATE INDEX idx_articles_search ON articles USING gin(search_vector);
```

### Index Maintenance
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;

-- Find unused indexes
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Rebuild index
REINDEX INDEX idx_users_email;
```

## Query Optimization Techniques

### 1. Avoid SELECT *
```sql
-- Bad
SELECT * FROM users WHERE active = true;

-- Good
SELECT id, name, email FROM users WHERE active = true;
```

### 2. Use Appropriate WHERE Clauses
```sql
-- Use indexed columns in WHERE clauses
SELECT * FROM orders WHERE user_id = 123;

-- Avoid functions in WHERE clauses
-- Bad
SELECT * FROM orders WHERE EXTRACT(year FROM created_at) = 2024;

-- Good
SELECT * FROM orders WHERE created_at >= ''2024-01-01'' AND created_at < ''2025-01-01'';
```

### 3. Optimize JOINs
```sql
-- Use proper JOIN syntax
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.active = true;

-- Consider JOIN order for multiple tables
-- PostgreSQL''s query planner usually handles this, but be aware
```

### 4. Use LIMIT for Large Result Sets
```sql
-- Pagination
SELECT * FROM articles
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;

-- Better pagination with cursor-based approach
SELECT * FROM articles
WHERE created_at < ''2024-01-01 12:00:00''
ORDER BY created_at DESC
LIMIT 20;
```

## Advanced Optimization Techniques

### 1. Materialized Views
For expensive queries that don''t need real-time data:

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
    user_id,
    COUNT(*) as order_count,
    SUM(total) as total_spent,
    AVG(total) as avg_order_value
FROM orders
GROUP BY user_id;

-- Refresh when needed
REFRESH MATERIALIZED VIEW user_stats;

-- Create index on materialized view
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
```

### 2. Partitioning
For very large tables:

```sql
-- Range partitioning by date
CREATE TABLE orders (
    id SERIAL,
    user_id INTEGER,
    created_at TIMESTAMP,
    total DECIMAL
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
FOR VALUES FROM (''2024-01-01'') TO (''2024-04-01'');

CREATE TABLE orders_2024_q2 PARTITION OF orders
FOR VALUES FROM (''2024-04-01'') TO (''2024-07-01'');
```

### 3. Connection Pooling
Use connection pooling to reduce connection overhead:

```javascript
// Using node.js with pg-pool
const { Pool } = require(''pg'');

const pool = new Pool({
  user: ''username'',
  host: ''localhost'',
  database: ''mydb'',
  password: ''password'',
  port: 5432,
  max: 20, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring and Maintenance

### 1. Query Monitoring
```sql
-- Enable query logging in postgresql.conf
log_statement = ''all''
log_min_duration_statement = 1000  -- Log queries taking >1 second

-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

### 2. Database Statistics
```sql
-- Update table statistics
ANALYZE users;

-- Vacuum to reclaim space
VACUUM ANALYZE users;

-- Auto-vacuum settings (in postgresql.conf)
autovacuum = on
autovacuum_vacuum_scale_factor = 0.1
autovacuum_analyze_scale_factor = 0.05
```

### 3. Performance Monitoring
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size(''mydb''));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||''.''||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||''.''||tablename) DESC;

-- Check index hit ratio
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes;
```

## Configuration Tuning

Key PostgreSQL settings for performance:

```
# Memory settings
shared_buffers = 256MB              # 25% of RAM
effective_cache_size = 1GB          # 75% of RAM
work_mem = 4MB                      # Per connection
maintenance_work_mem = 64MB         # For maintenance operations

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB

# Planner settings
random_page_cost = 1.1              # For SSDs
effective_io_concurrency = 200      # For SSDs
```

## Best Practices Summary

1. **Index Strategically**: Create indexes for frequently queried columns
2. **Monitor Regularly**: Use EXPLAIN ANALYZE and pg_stat_statements
3. **Vacuum Regularly**: Keep statistics up to date
4. **Avoid N+1 Queries**: Use JOINs or batch queries
5. **Use Appropriate Data Types**: Choose the smallest sufficient type
6. **Normalize Wisely**: Balance normalization with query performance
7. **Test with Real Data**: Performance characteristics change with data size

## Common Anti-Patterns to Avoid

1. **Over-indexing**: Too many indexes slow down writes
2. **Premature Optimization**: Profile first, optimize second
3. **Ignoring Query Plans**: Always check execution plans for slow queries
4. **Missing WHERE Clauses**: Always filter data as early as possible
5. **Using Functions in WHERE**: Avoid calculations in WHERE clauses

## Conclusion

Database optimization is an iterative process. Start with proper indexing, monitor query performance, and optimize based on actual usage patterns. Remember that premature optimization can be counterproductive—measure first, then optimize.',
  'Practical tips and techniques for optimizing database performance in real-world applications. Learn how to identify bottlenecks and improve PostgreSQL query performance.',
  null,
  ARRAY['Database', 'PostgreSQL', 'Performance', 'Backend', 'SQL'],
  true,
  4,
  null
);

-- Add a new external blog post example
INSERT INTO blog_posts (
  title,
  slug,
  content,
  excerpt,
  external_link,
  tags,
  published,
  order_index,
  image_url
) VALUES (
  'Advanced React Patterns on Dev.to',
  'advanced-react-patterns-dev-to',
  'External link to my comprehensive guide on advanced React patterns published on Dev.to',
  'Exploring advanced React patterns including compound components, render props, and custom hooks. A deep dive into professional React development techniques.',
  'https://dev.to/yourprofile/advanced-react-patterns',
  ARRAY['React', 'JavaScript', 'Frontend Development', 'Advanced Patterns'],
  true,
  5,
  null
);

-- Update the order_index for proper ordering
UPDATE blog_posts SET order_index = 1 WHERE slug = 'building-scalable-react-applications-lessons-from-production';
UPDATE blog_posts SET order_index = 2 WHERE slug = 'my-journey-from-computer-science-student-to-full-stack-developer';
UPDATE blog_posts SET order_index = 3 WHERE slug = 'understanding-machine-learning-algorithms-practical-guide';
UPDATE blog_posts SET order_index = 4 WHERE slug = 'optimizing-database-queries-postgresql-performance-tips';