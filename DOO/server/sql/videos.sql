CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `title` varchar(255) NOT NULL COMMENT '视频标题',
  `description` text COMMENT '视频描述',
  `video_url` varchar(500) NOT NULL COMMENT '视频URL',
  `cover_url` varchar(500) DEFAULT NULL COMMENT '封面图URL',
  `tags` varchar(255) DEFAULT NULL COMMENT '话题标签',
  `views` int(11) DEFAULT '0' COMMENT '播放量',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频表';
