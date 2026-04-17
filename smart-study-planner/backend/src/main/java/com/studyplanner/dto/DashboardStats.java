package com.studyplanner.dto;

public class DashboardStats {
    private long totalTasks;
    private long completedToday;
    private long pendingToday;
    private long totalCompleted;
    private long totalPending;
    private long focusSessionsToday;
    private int streakDays;

    public DashboardStats() {}

    public DashboardStats(long totalTasks, long completedToday, long pendingToday,
                          long totalCompleted, long totalPending,
                          long focusSessionsToday, int streakDays) {
        this.totalTasks = totalTasks;
        this.completedToday = completedToday;
        this.pendingToday = pendingToday;
        this.totalCompleted = totalCompleted;
        this.totalPending = totalPending;
        this.focusSessionsToday = focusSessionsToday;
        this.streakDays = streakDays;
    }

    public long getTotalTasks()         { return totalTasks; }
    public long getCompletedToday()     { return completedToday; }
    public long getPendingToday()       { return pendingToday; }
    public long getTotalCompleted()     { return totalCompleted; }
    public long getTotalPending()       { return totalPending; }
    public long getFocusSessionsToday() { return focusSessionsToday; }
    public int getStreakDays()          { return streakDays; }
}